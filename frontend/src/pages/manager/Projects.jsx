import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Topbar from '../../components/layout/Topbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../api/projectApi';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = () => {
    setLoading(true);
    getAllProjects()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({ name: '', description: '' });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({ name: project.name, description: project.description || '' });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingProject) {
        await updateProject(editingProject.id, form);
      } else {
        await createProject(form);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? Reports linked to it will keep their history but lose the project reference.')) return;
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete project.');
    }
  };

  return (
    <AppLayout>
      <Topbar
        title="Projects & Categories"
        subtitle="Manage the work categories your team reports against"
        action={<Button onClick={openCreateModal}>+ Add Project</Button>}
      />

      {loading ? (
        <Loader label="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add a project so your team can tag their weekly reports."
          action={<Button onClick={openCreateModal}>Add Project</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                  {p.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="font-bold text-surface-900 mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 flex-1 mb-4">{p.description || 'No description'}</p>
              <div className="flex gap-2 pt-3 border-t border-surface-100">
                <Button variant="secondary" size="sm" onClick={() => openEditModal(p)} className="flex-1">
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)} className="flex-1">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'}>
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Project name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Client A"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              placeholder="Brief description of this project"
            />
          </div>
          <Button type="submit" loading={saving} className="w-full">
            {editingProject ? 'Save Changes' : 'Add Project'}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
}
import { useState, useEffect } from 'react';
import { getAllProjects } from '../../api/projectApi';
import { getCurrentWeekStart, getWeekEnd } from '../../utils/dateHelpers';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ReportForm({ initialData, onSubmit, submitting }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    weekStart: initialData?.weekStart || getCurrentWeekStart(),
    weekEnd: initialData?.weekEnd || getWeekEnd(getCurrentWeekStart()),
    projectId: initialData?.projectId || '',
    tasksCompleted: initialData?.tasksCompleted || '',
    tasksPlanned: initialData?.tasksPlanned || '',
    blockers: initialData?.blockers || '',
    hoursWorked: initialData?.hoursWorked || '',
    notes: initialData?.notes || '',
  });

  useEffect(() => {
    getAllProjects().then((res) => setProjects(res.data)).catch(() => setProjects([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeekStartChange = (e) => {
    const newStart = e.target.value;
    setForm((prev) => ({ ...prev, weekStart: newStart, weekEnd: getWeekEnd(newStart) }));
  };

  const handleFormSubmit = (e, submitNow) => {
    e.preventDefault();
    const payload = {
      ...form,
      projectId: form.projectId ? Number(form.projectId) : null,
      hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : null,
    };
    onSubmit(payload, submitNow);
  };

  return (
    <form className="space-y-5">
      <Card>
        <h3 className="font-bold text-surface-900 mb-4 text-sm uppercase tracking-wide text-gray-400">Week & Project</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Week starts</label>
            <input type="date" name="weekStart" value={form.weekStart} onChange={handleWeekStartChange} required
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Week ends</label>
            <input type="date" name="weekEnd" value={form.weekEnd} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-surface-900 mb-1.5">Project / Category</label>
          <select name="projectId" value={form.projectId} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
            <option value="">— Select a project —</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-surface-900 mb-4 text-sm uppercase tracking-wide text-gray-400">Work Summary</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Tasks completed this week</label>
            <textarea name="tasksCompleted" value={form.tasksCompleted} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="What did you finish this week?" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Tasks planned for next week</label>
            <textarea name="tasksPlanned" value={form.tasksPlanned} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="What's next?" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Blockers / challenges</label>
            <textarea name="blockers" value={form.blockers} onChange={handleChange} rows={2}
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Anything blocking your progress? (Leave blank if none)" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">Hours worked <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" name="hoursWorked" value={form.hoursWorked} onChange={handleChange} step="0.5" min="0"
                className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. 38.5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Notes / links <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Any extra context, links to PRs, docs, etc." />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="secondary" size="lg" onClick={(e) => handleFormSubmit(e, false)} loading={submitting === 'draft'} className="flex-1">
          Save as Draft
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={(e) => handleFormSubmit(e, true)} loading={submitting === 'submit'} className="flex-1">
          Submit Report
        </Button>
      </div>
    </form>
  );
}
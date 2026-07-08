import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getAllMembers } from '../../api/userApi';
import { getProjectsForUser, assignUserToProject, removeAssignment } from '../../api/userProjectApi';

export default function AssignMembersModal({ isOpen, onClose, project }) {
  const [members, setMembers] = useState([]);
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!isOpen || !project) return;

    setLoading(true);
    getAllMembers()
      .then(async ({ data: memberList }) => {
        setMembers(memberList);

        const assignmentChecks = await Promise.all(
          memberList.map((m) =>
            getProjectsForUser(m.id)
              .then((res) => res.data.some((p) => p.projectId === project.id))
              .catch(() => false)
          )
        );

        const assigned = new Set();
        memberList.forEach((m, idx) => {
          if (assignmentChecks[idx]) assigned.add(m.id);
        });
        setAssignedIds(assigned);
      })
      .finally(() => setLoading(false));
  }, [isOpen, project]);

  const toggleAssignment = async (memberId) => {
    setSavingId(memberId);
    try {
      if (assignedIds.has(memberId)) {
        await removeAssignment(memberId, project.id);
        setAssignedIds((prev) => {
          const next = new Set(prev);
          next.delete(memberId);
          return next;
        });
      } else {
        await assignUserToProject({ userId: memberId, projectId: project.id });
        setAssignedIds((prev) => new Set(prev).add(memberId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update assignment.');
    } finally {
      setSavingId(null);
    }
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign members — ${project.name}`}>
      {loading ? (
        <p className="text-sm text-gray-400 py-6 text-center">Loading team members...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No team members found yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {members.map((m) => {
            const isAssigned = assignedIds.has(m.id);
            return (
              <div key={m.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-surface-100 hover:bg-surface-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs flex-shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.email}</p>
                  </div>
                </div>
                <Button
                  variant={isAssigned ? 'danger' : 'secondary'}
                  size="sm"
                  loading={savingId === m.id}
                  onClick={() => toggleAssignment(m.id)}
                >
                  {isAssigned ? 'Remove' : 'Assign'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
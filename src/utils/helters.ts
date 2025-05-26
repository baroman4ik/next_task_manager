export const formatTimeDifference = (dueDateString: string, status: string): { text: string; isOverdue: boolean; isWarning: boolean } => {
  if (!dueDateString || status === 'completed') return { text: '', isOverdue: false, isWarning: false };

  const now = new Date();
  const dueDate = new Date(dueDateString);

  const nowAtStartOfMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  const dueDateAtStartOfMinute = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate(), dueDate.getHours(), dueDate.getMinutes());

  const diffMs = dueDateAtStartOfMinute.getTime() - nowAtStartOfMinute.getTime();

  if (diffMs < 0) {
    return { text: 'Просрочено', isOverdue: true, isWarning: false };
  }

  const displayDiffMs = new Date(dueDateString).getTime() - new Date().getTime();
  if (displayDiffMs <= 0) {
    return { text: 'Просрочено', isOverdue: true, isWarning: false };
  }

  const diffDays = Math.floor(displayDiffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((displayDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((displayDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  let text = '';
  if (diffDays > 0) text += `${diffDays}д `;
  if (diffHours > 0) text += `${diffHours}ч `;
  if (diffMinutes > 0) text += `${diffMinutes}м `;

  const isWarning = diffDays === 0 && diffHours < 1;

  return { text: text.trim() || 'менее минуты', isOverdue: false, isWarning };
};

export const formatDueDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role || 'Користувач';

  return {
    canComment: ['Користувач', 'Автор', 'Журналіст', 'Модератор', 'Адміністратор'].includes(role),
    canVote: ['Користувач', 'Автор', 'Журналіст', 'Модератор', 'Адміністратор'].includes(role),
    canUseForum: ['Користувач', 'Автор', 'Журналіст', 'Модератор', 'Адміністратор'].includes(role),

    canAddNews: ['Журналіст', 'Адміністратор'].includes(role),

    canModerateComments: ['Модератор', 'Адміністратор'].includes(role),
    canEditNews: ['Модератор', 'Адміністратор'].includes(role),
    canManageUsers: ['Модератор', 'Адміністратор'].includes(role),

    canAccessAdminPanel: ['Адміністратор'].includes(role),
    canPublishWithoutApproval: ['Адміністратор'].includes(role),
    canManageAds: ['Адміністратор'].includes(role),
    canCreatePolls: ['Адміністратор'].includes(role),

    canWriteBlog: ['Запрошений автор', 'Адміністратор'].includes(role),
  };
};

import { useAuth } from './useAuth';

export const usePermissions = () => {
    const { user } = useAuth();

    const role = user?.role || '���������������';

    return {
        canComment: ['�������������', '��������', '���������', '������������', '���������� �����'].includes(role),
        canVote: ['�������������', '��������', '���������', '������������', '���������� �����'].includes(role),
        canUseForum: ['�������������', '��������', '���������', '������������', '���������� �����'].includes(role),

        canAddNews: ['��������', '������������'].includes(role),

        canModerateComments: ['���������', '������������'].includes(role),
        canEditNews: ['���������', '������������'].includes(role),
        canManageUsers: ['���������', '������������'].includes(role),

        canAccessAdminPanel: ['������������'].includes(role),
        canPublishWithoutApproval: ['������������'].includes(role),
        canManageAds: ['������������'].includes(role),
        canCreatePolls: ['������������'].includes(role),

        canWriteBlog: ['���������� �����', '������������'].includes(role),
    };
};
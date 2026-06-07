<<<<<<< HEAD
import { useAuth } from './useAuth';

export const usePermissions = () => {
    const { user } = useAuth();

    const role = user?.role || 'Незареєстрований';

    return {
        canComment: ['Зареєстрований', 'Журналіст', 'Модератор', 'Адміністратор', 'Запрошений автор'].includes(role),
        canVote: ['Зареєстрований', 'Журналіст', 'Модератор', 'Адміністратор', 'Запрошений автор'].includes(role),
        canUseForum: ['Зареєстрований', 'Журналіст', 'Модератор', 'Адміністратор', 'Запрошений автор'].includes(role),

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
=======
import { useAuth } from './useAuth';

export const usePermissions = () => {
    const { user } = useAuth();

    const role = user?.role || 'Незареєстрований';

    return {
        canComment: ['Зареєстрований', 'Журналіст', 'Модератор', 'Адміністратор', 'Запрошений автор'].includes(role),
        canVote: ['Зареєстрований', 'Журналіст', 'Модератор', 'Адміністратор', 'Запрошений автор'].includes(role),
        canUseForum: ['Зареєстрований', 'Журналіст', 'Модератор', 'Адміністратор', 'Запрошений автор'].includes(role),

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
>>>>>>> upstream/main
};
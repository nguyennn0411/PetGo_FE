export const REGISTRATION_TYPE = {
    PARTNER: 'PARTNER',
    AFFILIATE: 'AFFILIATE',
};

export const REGISTRATION_STATUS = {
    DRAFT: 'DRAFT',
    AWAITING_APPROVAL: 'AWAITING_APPROVAL',
    NEEDS_MORE_INFO: 'NEEDS_MORE_INFO',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};

export const REGISTRATION_STATUS_LABEL = {
    [REGISTRATION_STATUS.DRAFT]: 'Đang tạo hồ sơ',
    [REGISTRATION_STATUS.AWAITING_APPROVAL]: 'Đang chờ duyệt',
    [REGISTRATION_STATUS.NEEDS_MORE_INFO]: 'Cần bổ sung thông tin',
    [REGISTRATION_STATUS.APPROVED]: 'Đã duyệt',
    [REGISTRATION_STATUS.REJECTED]: 'Đã từ chối',
};

export const REGISTRATION_STATUS_BADGE_CLASS = {
    [REGISTRATION_STATUS.DRAFT]: 'bg-gray-50 text-gray-600 border-gray-100',
    [REGISTRATION_STATUS.AWAITING_APPROVAL]: 'bg-orange-50 text-orange-600 border-orange-100',
    [REGISTRATION_STATUS.NEEDS_MORE_INFO]: 'bg-blue-50 text-blue-600 border-blue-100',
    [REGISTRATION_STATUS.APPROVED]: 'bg-green-50 text-green-600 border-green-100',
    [REGISTRATION_STATUS.REJECTED]: 'bg-red-50 text-red-600 border-red-100',
};
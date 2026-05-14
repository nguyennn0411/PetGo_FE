import React from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

export const PartnerLoadingState = ({ message = 'Đang tải dữ liệu partner...' }) => (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-10 text-center shadow-sm">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
        <p className="text-gray-500 font-bold">{message}</p>
    </div>
);

export const PartnerEmptyState = ({ title = 'Chưa có dữ liệu', message = 'Dữ liệu sẽ xuất hiện tại đây khi có phát sinh.', action }) => (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-10 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 font-semibold max-w-lg mx-auto">{message}</p>
        {action && <div className="mt-5">{action}</div>}
    </div>
);

export const PartnerErrorState = ({ message = 'Không thể tải dữ liệu.', onRetry }) => (
    <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-bold">
            <AlertTriangle className="w-5 h-5" />
            {message}
        </div>
        {onRetry && (
            <button onClick={onRetry} className="px-4 py-2 rounded-xl bg-white text-red-600 text-xs font-black uppercase tracking-widest border border-red-100 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Thử lại
            </button>
        )}
    </div>
);

export const PartnerStatusBadge = ({ status }) => {
    const normalized = String(status || '').toUpperCase();
    const cls = normalized.includes('CANCEL')
        ? 'bg-red-50 text-red-600 border-red-100'
        : normalized.includes('COMPLETE') || normalized.includes('ACTIVE') || normalized.includes('CONFIRMED')
            ? 'bg-green-50 text-green-600 border-green-100'
            : normalized.includes('PROGRESS')
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : 'bg-orange-50 text-orange-600 border-orange-100';
    return <span className={`px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-widest ${cls}`}>{status || 'N/A'}</span>;
};
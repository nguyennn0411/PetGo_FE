import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

const toneConfig = {
    success: {
        icon: CheckCircle2,
        defaultTitle: 'Thành công',
    },
    error: {
        icon: XCircle,
        defaultTitle: 'Không thể hoàn tất',
    },
    warning: {
        icon: AlertTriangle,
        defaultTitle: 'Cần chú ý',
    },
    info: {
        icon: Info,
        defaultTitle: 'Thông tin',
    },
};

const getToneConfig = (tone) => toneConfig[tone] || toneConfig.info;

export const getAdminErrorMessage = (error, fallback = 'Thao tác thất bại. Vui lòng thử lại.') => {
    const responseData = error?.response?.data;
    if (typeof responseData === 'string') return responseData;
    return responseData?.message || responseData?.error || error?.message || fallback;
};

export const useAdminToast = (autoDismissMs = 4200) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const dismissToast = useCallback((toastId) => {
        if (timersRef.current[toastId]) {
            clearTimeout(timersRef.current[toastId]);
            delete timersRef.current[toastId];
        }
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
    }, []);

    const showToast = useCallback((toast, options = {}) => {
        const tone = toast?.tone || 'info';
        const id = toast?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const nextToast = {
            id,
            tone,
            title: toast?.title || getToneConfig(tone).defaultTitle,
            message: toast?.message || '',
        };

        setToasts((currentToasts) => [nextToast, ...currentToasts.filter((item) => item.id !== id)].slice(0, 4));

        const timeout = options.timeout ?? (tone === 'error' ? Math.max(autoDismissMs, 6500) : autoDismissMs);
        if (timeout > 0 && typeof window !== 'undefined') {
            if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
            timersRef.current[id] = window.setTimeout(() => dismissToast(id), timeout);
        }

        return id;
    }, [autoDismissMs, dismissToast]);

    useEffect(() => () => {
        Object.values(timersRef.current).forEach((timerId) => clearTimeout(timerId));
    }, []);

    return { toasts, showToast, dismissToast };
};

export const useAdminDialog = () => {
    const [dialog, setDialog] = useState(null);
    const resolverRef = useRef(null);

    const openDialog = useCallback((config) => new Promise((resolve) => {
        resolverRef.current = resolve;
        setDialog({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tone: 'info',
            ...config,
        });
    }), []);

    const closeDialog = useCallback((value) => {
        if (resolverRef.current) {
            resolverRef.current(value);
            resolverRef.current = null;
        }
        setDialog(null);
    }, []);

    const confirmDialog = useCallback((options = {}) => openDialog({
        mode: 'confirm',
        confirmLabel: 'Xác nhận',
        cancelLabel: 'Hủy',
        ...options,
    }), [openDialog]);

    const promptDialog = useCallback((options = {}) => openDialog({
        mode: 'prompt',
        confirmLabel: 'OK',
        cancelLabel: 'Hủy',
        defaultValue: '',
        multiline: true,
        ...options,
    }), [openDialog]);

    useEffect(() => () => {
        if (resolverRef.current) resolverRef.current(null);
    }, []);

    return { dialog, confirmDialog, promptDialog, closeDialog };
};

export const AdminToastStack = ({ toasts = [], onDismiss }) => {
    if (!toasts.length) return null;

    return (
        <div className="admin-toast-viewport" aria-live="polite" aria-relevant="additions removals">
            {toasts.map((toast) => {
                const config = getToneConfig(toast.tone);
                const Icon = config.icon;
                return (
                    <div key={toast.id} className={`admin-toast admin-toast-${toast.tone || 'info'}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
                        <div className="admin-toast-icon">
                            <Icon size={20} strokeWidth={2.5} />
                        </div>
                        <div className="admin-toast-content">
                            <div className="admin-toast-title">{toast.title || config.defaultTitle}</div>
                            {toast.message ? <div className="admin-toast-message">{toast.message}</div> : null}
                        </div>
                        <button className="admin-toast-close" type="button" onClick={() => onDismiss?.(toast.id)} aria-label="Đóng thông báo">
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export const AdminInlineNotice = ({ tone = 'info', title, children, onDismiss }) => {
    const config = getToneConfig(tone);
    const Icon = config.icon;

    return (
        <div className={`admin-notice admin-notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
            <div className="admin-notice-icon">
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="admin-notice-content">
                <div className="admin-notice-title">{title || config.defaultTitle}</div>
                {children ? <div className="admin-notice-message">{children}</div> : null}
            </div>
            {onDismiss ? (
                <button className="admin-notice-close" type="button" onClick={onDismiss} aria-label="Đóng thông báo">
                    <X size={16} strokeWidth={2.5} />
                </button>
            ) : null}
        </div>
    );
};

export const AdminDialog = ({ dialog, onResolve }) => {
    const [value, setValue] = useState('');
    const [fieldError, setFieldError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        setValue(dialog?.defaultValue || '');
        setFieldError('');
        if (dialog?.mode === 'prompt') {
            window.setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [dialog?.id, dialog?.defaultValue, dialog?.mode]);

    if (!dialog) return null;

    const tone = dialog.tone || 'info';
    const config = getToneConfig(tone);
    const Icon = config.icon;
    const isPrompt = dialog.mode === 'prompt';
    const confirmButtonClass = tone === 'error' || tone === 'danger'
        ? 'btn-danger'
        : tone === 'warning'
            ? 'btn-warning'
            : tone === 'success'
                ? 'btn-success'
                : 'btn-primary';

    const handleCancel = () => onResolve?.(isPrompt ? null : false);
    const handleConfirm = () => {
        if (isPrompt) {
            if (dialog.required && !value.trim()) {
                setFieldError(dialog.requiredMessage || 'Vui lòng nhập nội dung trước khi tiếp tục.');
                return;
            }
            onResolve?.(value);
            return;
        }
        onResolve?.(true);
    };

    return (
        <div className="admin-dialog-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && handleCancel()}>
            <div className={`admin-dialog admin-dialog-${tone}`} role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
                <div className="admin-dialog-header">
                    <div className="admin-dialog-icon">
                        <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <div className="admin-dialog-heading">
                        <div id="admin-dialog-title" className="admin-dialog-title">{dialog.title || config.defaultTitle}</div>
                        {dialog.message ? <div className="admin-dialog-message">{dialog.message}</div> : null}
                    </div>
                    <button className="admin-dialog-close" type="button" onClick={handleCancel} aria-label="Đóng hộp thoại">
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {isPrompt ? (
                    <div className="admin-dialog-body">
                        {dialog.multiline === false ? (
                            <input
                                ref={inputRef}
                                value={value}
                                onChange={(event) => { setValue(event.target.value); setFieldError(''); }}
                                placeholder={dialog.placeholder || 'Nhập nội dung...'}
                                maxLength={dialog.maxLength || undefined}
                            />
                        ) : (
                            <textarea
                                ref={inputRef}
                                value={value}
                                onChange={(event) => { setValue(event.target.value); setFieldError(''); }}
                                placeholder={dialog.placeholder || 'Nhập nội dung...'}
                                rows={dialog.rows || 4}
                                maxLength={dialog.maxLength || undefined}
                            />
                        )}
                        {dialog.helperText ? <div className="admin-dialog-helper">{dialog.helperText}</div> : null}
                        {fieldError ? <div className="admin-dialog-error">{fieldError}</div> : null}
                    </div>
                ) : null}

                <div className="admin-dialog-actions">
                    <button type="button" className="btn" onClick={handleCancel}>{dialog.cancelLabel || 'Hủy'}</button>
                    <button type="button" className={`btn ${confirmButtonClass}`} onClick={handleConfirm}>{dialog.confirmLabel || 'Xác nhận'}</button>
                </div>
            </div>
        </div>
    );
};

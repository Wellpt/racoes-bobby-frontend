import { useEffect, type MouseEvent, type PropsWithChildren } from 'react'

interface ConfirmDialogProps extends PropsWithChildren {
  title: string
  confirmLabel: string
  busyLabel: string
  isBusy: boolean
  error?: string | null
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  title,
  confirmLabel,
  busyLabel,
  isBusy,
  error,
  onClose,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isBusy) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isBusy, onClose])

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isBusy) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <section className="confirm-dialog" role="dialog" aria-modal="true">
        <span className="confirm-icon" aria-hidden="true">!</span>
        <h2>{title}</h2>
        <div className="confirm-message">{children}</div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions">
          <button className="secondary-button" type="button" onClick={onClose} disabled={isBusy}>
            Cancelar
          </button>
          <button className="danger-button" type="button" onClick={onConfirm} disabled={isBusy}>
            {isBusy ? busyLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}


// src/components/BaseModal.jsx
export function BaseModal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[99999] overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] flex flex-col relative my-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 shrink-0">
          {title}
        </h3>
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
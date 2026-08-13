// src/components/PageHeader.jsx
export function PageHeader({ title, buttonText, onButtonClick }) {
  return (
    <>
      <div className="relative flex items-center justify-center mb-6 pt-2">
        <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
      </div>

      {buttonText && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
          >
            {buttonText}
          </button>
        </div>
      )}
    </>
  );
}
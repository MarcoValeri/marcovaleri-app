interface AdminInputCheckboxProps {
    id: string;
    label: string;
    name: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
}

const AdminInputCheckbox = ({ 
    id, 
    label, 
    name, 
    checked,
    defaultChecked, 
    onChange, 
    error = false, 
    errorMessage = '', 
    disabled = false, 
    required = false 
}: AdminInputCheckboxProps ) => {
    return (
        <div className="flex flex-col gap-2 font-sans text-[16px] font-normal">
            <label htmlFor={id} className={`flex items-center gap-3 leading-[120%] md:leading-5 cursor-pointer ${error ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-[#171C32]'}`}>
                <input 
                    id={id}
                    type="checkbox" 
                    name={name}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    aria-invalid={error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`w-5 h-5 rounded border-2 transition-colors focus:ring-2 focus:ring-offset-1 ${
                        disabled 
                            ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                            : error 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-[#171C32] focus:ring-blue-200 hover:border-gray-400'
                    }`} 
                />
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && errorMessage && (
                <span id={`${id}-error`} className="text-sm text-red-500 ml-8">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}

export default AdminInputCheckbox;
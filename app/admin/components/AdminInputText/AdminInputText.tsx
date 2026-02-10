interface AdminInputTextProps {
    id: string;
    label: string;
    name: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    errorMessage?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

const AdminInputText = ({ 
    id, 
    label, 
    name, 
    value,
    defaultValue, 
    onChange, 
    error = false, 
    errorMessage = '', 
    placeholder, 
    disabled = false, 
    required = false 
}: AdminInputTextProps ) => {
    return (
        <div className="flex flex-col gap-2 font-sans text-[16px] font-normal">
            <label htmlFor={id} className={`leading-[120%] md:leading-5 ${error ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-[#171C32]'}`}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
                id={id}
                type="text" 
                name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                aria-invalid={error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`py-2 px-4 rounded-[10px] border outline-none transition-colors focus:ring-2 focus:ring-offset-1 ${
                    disabled 
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                        : error 
                        ? 'text-[#171C32] border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'text-[#171C32] border-[#171C32] focus:border-[#171C32] focus:ring-blue-200 hover:border-gray-400'
                }`} 
            />
            {error && errorMessage && (
                <span id={`${id}-error`} className="text-sm text-red-500">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}

export default AdminInputText;
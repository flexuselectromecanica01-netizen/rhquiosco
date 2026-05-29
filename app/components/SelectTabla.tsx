
export function SelectTabla({
  value,
  opciones,
  onChange,
  disabled = false,
}: {
  value: string;
  opciones: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    >
      {opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
  );
}
interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OrderNote({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8">
      <h2 className="text-4xl font-semibold mb-8">Ghi chú đơn hàng</h2>

      <textarea
        rows={5}
        placeholder="Lưu ý cho người giao hàng..."
        className="w-full rounded-2xl border border-[#E5D8BA] p-5 resize-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

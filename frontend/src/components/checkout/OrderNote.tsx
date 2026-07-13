interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OrderNote({ value, onChange }: Props) {
  return (
    <section className="checkout-card">
      <h2>Ghi chú đơn hàng</h2>
      <textarea
        rows={4}
        placeholder="Lưu ý cho người giao hàng, mã cửa..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </section>
  );
}

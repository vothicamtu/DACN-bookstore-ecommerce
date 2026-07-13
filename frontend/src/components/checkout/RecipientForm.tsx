export interface RecipientFormValue {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  district: string;
}

interface Props {
  value: RecipientFormValue;
  onChange: (value: RecipientFormValue) => void;
}

export default function RecipientForm({ value, onChange }: Props) {
  function updateField(field: keyof RecipientFormValue, nextValue: string) {
    onChange({ ...value, [field]: nextValue });
  }

  return (
    <section className="checkout-card">
      <h2>Thông tin người nhận</h2>
      <div className="checkout-formGrid">
        <label>
          <span>Họ và tên</span>
          <input
            placeholder="Nguyễn Văn A"
            value={value.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </label>
        <label>
          <span>Số điện thoại</span>
          <input
            type="tel"
            placeholder="0901 234 567"
            value={value.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
          />
        </label>
        <label className="is-wide">
          <span>Email</span>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={value.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className="is-wide">
          <span>Địa chỉ cụ thể</span>
          <input
            placeholder="Số nhà, tên đường..."
            value={value.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </label>
        <label>
          <span>Tỉnh / Thành phố</span>
          <select value={value.city} onChange={(event) => updateField("city", event.target.value)}>
            <option>TP Hồ Chí Minh</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
          </select>
        </label>
        <label>
          <span>Quận / Huyện</span>
          <input
            placeholder="Quận / Huyện"
            value={value.district}
            onChange={(event) => updateField("district", event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}

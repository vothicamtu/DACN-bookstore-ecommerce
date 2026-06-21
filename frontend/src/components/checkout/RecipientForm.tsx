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
    onChange({
      ...value,
      [field]: nextValue,
    });
  }

  return (
    <div className="bg-white rounded-[28px] border border-[#E5D8BA] p-8">
      <h2 className="text-4xl font-semibold mb-8">Thông tin người nhận</h2>

      <div className="grid grid-cols-2 gap-6">
        <input
          placeholder="Họ và tên"
          className="input-checkout"
          value={value.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
        />

        <input
          placeholder="Số điện thoại"
          className="input-checkout"
          value={value.phoneNumber}
          onChange={(event) => updateField("phoneNumber", event.target.value)}
        />
      </div>

      <input
        placeholder="Email"
        className="input-checkout mt-6 w-full"
        value={value.email}
        onChange={(event) => updateField("email", event.target.value)}
      />

      <input
        placeholder="Địa chỉ cụ thể"
        className="input-checkout mt-6 w-full"
        value={value.address}
        onChange={(event) => updateField("address", event.target.value)}
      />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <select
          className="input-checkout"
          value={value.city}
          onChange={(event) => updateField("city", event.target.value)}
        >
          <option>TP Hồ Chí Minh</option>
          <option>Hà Nội</option>
          <option>Đà Nẵng</option>
        </select>

        <input
          placeholder="Quận / Huyện"
          className="input-checkout"
          value={value.district}
          onChange={(event) => updateField("district", event.target.value)}
        />
      </div>
    </div>
  );
}

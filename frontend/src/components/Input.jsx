export default function Input({label, name, ...props}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input name={name} id={name} {...props}  />
    </>
  )
}
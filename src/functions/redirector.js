export default function redirect(props)  {
    const ref = props.to
    return <script>
        window.href = {ref}
    </script>;
}
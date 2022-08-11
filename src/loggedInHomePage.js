import urls from "./variables/urls"
export default function Feeds(props) {

    console.log(props)

    return  <h1>loged in as {props.data.raw_data.username} ({props.data.raw_data.name})</h1>

}
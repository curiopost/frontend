import urls from "./variables/urls"
export default function Feeds(props) {

document.title = `Curiopost (@${props.data.raw_data.username})`

    return  <h1>logged in as {props.data.raw_data.username} ({props.data.raw_data.name})</h1>

}
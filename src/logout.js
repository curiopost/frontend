import  { Navigate } from 'react-router-dom'

export default function Logout() {

  const clearLocalStorage = () => {
    return window.localStorage.clear() 
  }
 clearLocalStorage()


        
        

 return <Navigate to='/'  />
}






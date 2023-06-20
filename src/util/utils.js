export const FormatDate = (date) => {
    if(date == null) return null;
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    const formattedDate = `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`;
    return formattedDate
  }

export const isProjectFinished = (id) => {
  const res = fetch("http://localhost:3000/getprojectbyid",{
    method: "POST",
    headers: {
        "Content-Type" : "application/json" 
    },
    body: JSON.stringify({project_id:id})
  })
  const data = res.then(res => res.json())
  const status = data.then(data => {
    if(data.status=="completed")
    return true
    else return false
  })
  if(status) return true
  else return false
}

export const isAdmin = () => {
  if(sessionStorage.getItem('role')=="admin")
  return true
  else
  return false
}

export function getLastSaturday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6
  const diff = dayOfWeek > 6 ? dayOfWeek - 6 : 1 + dayOfWeek; // Calculate the difference from Saturday
  const lastSaturday = new Date(today.setDate(today.getDate() - diff));
  return lastSaturday;
}

export function doFilter(data,searchkey){
  const values = data.map(e => Object.values(e))
  const valuesarray = values.map((e,index) => {
    return e.reduce((acc,curr) => {
      if(new Date(curr) instanceof Date && !isNaN(new Date(curr)) && typeof(curr)!="number"){
        return acc.concat(FormatDate(new Date(curr)))
      }
      else
      return acc.concat(curr)
    },"")
  })
  return data.filter((obj,index)=>valuesarray[index].toLowerCase().includes(searchkey))
}
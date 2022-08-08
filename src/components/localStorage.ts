export const saveDarkThemeState = (state : any) => {
  localStorage.setItem('dark-theme', state);
}

export const loadDarkThemeState = () => {
  if(localStorage.getItem('dark-theme')) return localStorage.getItem('dark-theme');
  else return null;
}
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };
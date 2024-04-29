const Notification = ({ message, error }) => {
    if (message === null && error === null) {
      return null
    }
  
    return (
      <div>
        {message !== null && (
          <div className='message'>
            {message}
          </div>
        )}
  
        {error !==null && (
          <div className='error'>
            {error}
          </div>
        )}
      </div>
    )
  }
  
  export default Notification
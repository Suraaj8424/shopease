const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="d-flex flex-column align-items-center
                  justify-content-center py-5">
    <div className="spinner-border text-primary mb-3" role="status" />
    <p className="text-muted">{message}</p>
  </div>
);

export default LoadingSpinner;
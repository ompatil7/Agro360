import SyncLoader from "react-spinners/SyncLoader";

function ApiLoading() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-center">
          <h4>Loading please wait</h4>
          <SyncLoader
            color="#36d7b7"
            loading={true}
            // cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    </>
  );
}

export default ApiLoading;

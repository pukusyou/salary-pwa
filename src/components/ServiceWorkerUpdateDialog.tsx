import { useState } from "react";

// 略

const ServiceWorkerUpdateDialog = (props: {
  registration: ServiceWorkerRegistration;
}) => {
  const { registration } = props;
  const [show, setShow] = useState(!!registration.waiting);
  const handleUpdate = () => {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    setShow(false);
  };

  return (
    <div className={`fixed inset-0 ${show ? "block" : "hidden"} z-50`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-lg font-semibold mb-4">
            アップデート通知
          </h2>
          <p className="text-center mb-6">
            新しいバージョンがリリースされました。
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              アップデート
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkerUpdateDialog;

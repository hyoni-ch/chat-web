import React, { useState } from "react";

const NicknameModal = ({ onSubmit }) => {
  const [nickname, setNickname] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

  const checkNicknameAvailability = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`/check-nickname?nickname=${encodeURIComponent(nickname)}`);
      if (!response.ok) {
        throw new Error("check-nickname Error!");
      }
      const result = await response.json();
      setIsAvailable(result.available);
      setIsConfirmEnabled(result.available);
    } catch (error) {
      console.error("Error checking nickname:", error);
      setIsAvailable(false);
      setIsConfirmEnabled(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setIsAvailable(null);
    setIsConfirmEnabled(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname && isAvailable) {
      onSubmit(nickname);
    }
  };

  return (
    <div style={modalStyle}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-bold text-lg">닉네임 설정</h1>
          <div className="flex  justify-center content-center gap-2">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              maxlength="5"
              value={nickname}
              onChange={handleNicknameChange}
              className="shadow appearance-none border rounded px-3 text-gray-700 leading-tight"
            />
            <button
              type="button"
              onClick={checkNicknameAvailability}
              disabled={isChecking}
              className="text-white bg-black hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {isChecking ? "중복 확인 중..." : "중복확인"}
            </button>
          </div>
          <div>
            {isAvailable === false && <p style={{ color: "red" }}>사용 불가능한 닉네임입니다.</p>}
            {isAvailable === true && <p style={{ color: "green" }}>사용 가능한 닉네임입니다.</p>}
          </div>
          <div className="flex justify-center content-center">
            <button
              type="submit"
              disabled={!isConfirmEnabled}
              className={`${
                isConfirmEnabled
                  ? `text-white bg-black hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer`
                  : `text-white bg-gray-400  font-medium rounded-lg text-sm px-5 py-2.5`
              }`}
            >
              확인
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  right: "24px",
  transform: "translateY(-50%)",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  padding: "1rem",
  zIndex: 1000,
};

export default NicknameModal;

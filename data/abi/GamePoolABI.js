export const GAMEPOOLABI = [
    "function create(uint amount) external returns (bool)",
    "function bet(uint id, uint amount, uint8 poolId, uint8 ruleId, uint8 number) external returns (bool)",
    // function withdraw(uint amount, uint poolId) external returns (bool);
    "function pool(uint8 poolId) external view returns (uint, uint, bool, address)",
    "function close(uint poolId) external returns (bool)",
    "function result(uint id) external view returns (uint, bool, uint8)",
    "function withdraw(uint id) external",
    "function setRequestParameters(address _airnode, bytes32 _endpointIdUint256, address _sponsorWallet) external",
    "function last(address better) external view returns (uint, uint, uint8, uint8, bytes32, uint8, bool)",

    "event Result(address indexed better, uint id, uint amount, uint netWin, uint ruleId, uint8 random)",
    "event Created(address indexed creator, uint poolId)",
    "event FullFiled(bytes32 requestId, uint256 data)",
    "event ResultObtained(address indexed better, uint id, uint amount, uint8 betNumber, uint8 random, uint8 odds, uint netWin, uint height)"
];
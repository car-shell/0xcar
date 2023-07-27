import { ChainId } from "./chainId";

export const ADDRESSES = {
    [ChainId.ARBITRUM_GOERLI]: {
        token: "0xd5a8f6fD80BA3EC9b0FA91152B3e7E213fF4FFb6",
        // game: "0x9470fd00CCe1a181ca4ae97f7e4E45410bbebadA",
        game: "0xA8f9F957d9626308F0CEe19547c772090528832e",
        faucet: "0x7EEEAc8617b4384B577406BF8C042FFB2503a5dF",
        // nft: "0xddC8710FCd6bDef8bCBC3C2a0DE579Fe6945Ac2a",
        // nft: "0xD255e4Cb0A573AF9D5c2C9A653dc2b13b9090d00",
        nft: "0x4343c48a373708a907Ef2F31bBD4be8B5c3b94E1",
        // sponsor: "0x7B53af10bc94d88dA13a3CA7E3cD65786dBC4f79",
        sponsor: "0x545EB42B7631ec21D1101f6f2af4d55424eE2AdF",
    },
    [ChainId.GOERLI]: {
        token: "0xBbBf20C954A52CF33690E1605df60aEE6b60319d",
        game: "0x590cABAC26C6628d3CFA06f847b86fD6ABDb0F01",
        faucet: "0x632387781d3C9275A9483AbFC392c61b0BBB179f"
    },
    // [ChainId.BSC_TESTNET]: {
    //     token: "0x73Dbec3Bf5eF7C78d097a287ba7b6F263e619fCD",
    //     nft: "0x7379BEC08492b7E21d979282EE32d76Ccc56a170",
    //     game: "0x3E58E1B170FA0B7CF582d4868A7Aa632BB36a3E2",
    //     faucet: "0x1a971f0bd7CCc21AF278A4d133095C5200c43559",
    //     sponsor: "0x662B1AA48b798D929b52aAC20E2ab991684A0B0C"
    // },
    [ChainId.BSC_TESTNET]: {
        token: "0xC89b11ba4C36a43e389dc359eDbC9DfFfE13481d",
        nft: "0x7aa86926A71c7eEC95Ad6A109Db31c1B5991e15A",
        game: "0x54B37600E3fD51b8697385698c7Ce71A129Cd650",
        faucet: "0x6D70B8d77B12211915aEf7D93E58352B4d003efC",
       
        topic_bet: "0xf72a0c6bfea8817d7f217bc11fc5ad038a6f315f4643be2649cf23a39e51c4f4",
        topic_win: "0x9f8ce2e31646e98e72e097e8abe5539ff064932fc90b722b121b9c83f9351b40",
        topic_got_result: "0xf72a0c6bfea8817d7f217bc11fc5ad038a6f315f4643be2649cf23a39e51c4f4",
        sponsor: "0x838E1EEa13250Bf6C04cE7b0Baf9d2e0aF99C1E0",
    }
};
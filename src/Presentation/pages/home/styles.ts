import styled from "styled-components";

export const Container = styled.div`
    overflow-y: scroll;
    position: fixed;
    width: 100%;
    margin-top: 65px;
    margin-left: 200px;
    max-width: calc(100% - 200px);
    height: calc(100% - 65px);
    display:flex;
    flex-wrap: wrap;
  
  /* Webkit-specific styles for Chrome and Safari */
  &::-webkit-scrollbar {
    width: 5px; /* Width of the scrollbar track */
  }

  &::-webkit-scrollbar-thumb {
    background: #222b45; /* Background color of the scrollbar thumb */
  }
`
export const LeftContainer = styled.div`
`
export const RightContainer = styled.div`
`
export const CardsContainer = styled.div`
`
export const BannerContainer = styled.div`
`
export const LastTransactionsContainer = styled.div`
`
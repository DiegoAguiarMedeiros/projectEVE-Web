import styled from "styled-components";

export const Container = styled.div`
    overflow-y: scroll;
    width: 100%;
    height: 100%;
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
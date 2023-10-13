import styled from 'styled-components';

export const Container = styled.div`
    width: 33%;
    flex: 1;
    height: 150px;
    background: linear-gradient(to bottom, #192038, #1e1e20);
    border-radius: 10px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    padding: 10px 25px;
`

export const Header = styled.div`
display: flex;
flex-direction: row;
align-items: center;
height: 30%;
`
export const Body = styled.div`
height: 70%;
display: flex;
`
export const BodyValue = styled.div`
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: stretch;
`
export const BodyGraph = styled.div`
flex: 1;
display: flex;
flex-direction: row;
justify-items: flex-end;
align-items: flex-end;

`

export const Title = styled.h2`
    flex:10;
    color : #E4E9F2;
    `
export const Amount = styled.h3`
font-weight: 300;
    flex:2;
    margin: 0;
    padding: 0;
    color : #E4E9F2;
`

export const Graph = styled.div`
    width: 100%;
    height: 50px;
`
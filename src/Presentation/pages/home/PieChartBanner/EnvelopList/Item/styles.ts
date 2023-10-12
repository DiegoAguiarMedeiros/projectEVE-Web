import { Slider } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #E4E9F2;
`
export const ContainerHeader = styled.div`
display: flex;
flex: 1;
justify-content: center;
align-items: center;
`
export const ContainerBody = styled.div`
flex: 1;
`

export const ContainerName = styled.div`
flex: 3;
`
export const ContainerValue = styled.div`
    flex: 1;
`
export const ContainerProgress = styled.div`
    padding: 0 5px;
    flex: 1;
`
interface PrettoSliderProps {
  colorSlider: string;
  valueLabelDisplay?: "auto" | "on" | "off";
  "aria-label"?: string;
  defaultValue?: number;
}

export const PrettoSlider = styled(Slider)<PrettoSliderProps>(({ colorSlider }) => ({
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    color:colorSlider,
    fontWeight:600,
    border:"1px solid "+colorSlider,
    backgroundColor: '#192038',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));
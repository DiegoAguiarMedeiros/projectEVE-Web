import { Slider } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
export const ContainerSlide = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
export const ContainerVal = styled.div`
    margin: -10px 0 10px 0;
    color:#E4E9F2;
    font-weight: 300;
    font-size: 0.7rem;
    text-align: center;
    display: flex;
    flex-direction: row;
    width: 100%;
`
export const ContainerValue = styled.div<{
  with:number;
}>`
    width: ${(props: { with: number }) => `${props.with}%`};
`
export const ContainerUsed = styled.div<{
  with:number;
}>`
    width: ${(props: { with: number }) => `${props.with}%`};
`

interface PrettoSliderProps {
  colorSlider: string;
  valueLabelDisplay?: "auto" | "on" | "off";
  "aria-label"?: string;
  defaultValue?: number;
}

export const PrettoSlider = styled(Slider)<PrettoSliderProps>(({ colorSlider }) => ({
  height: '6px!important',
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
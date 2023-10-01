declare module 'react-native-progress/Bar' {
  import {Component} from 'react';

  interface ProgressBarProps {
    progress: number;
    width?: number;
    height?: number;
    borderRadius?: number;
    color?: string;
    unfilledColor?: string;
    borderColor?: string;
    borderWidth?: number;
    animated?: boolean;
  }

  export default class ProgressBar extends Component<ProgressBarProps> {}
}

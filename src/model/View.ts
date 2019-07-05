interface View {
  id: string;
  vertical: boolean;
  horizontal: boolean;
  width: number;
  height: number;
  widthRatio: number;
  heightRatio: number;
  views: View[];
}

export default View;

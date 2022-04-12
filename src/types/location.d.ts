interface TDuration {
  from: number;
  to: number;
}

interface Query {
  tag: string;
  duration: TDuration | null;
  type: MemoSpecType | '';
  text: string;
  filter: string;
}

type AppRouter = '/' | '/homeboard' | '/recycle' | '/setting';

interface AppLocation {
  pathname: AppRouter;
  hash: string;
  query: Query;
}

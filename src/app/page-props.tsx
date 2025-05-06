export interface PageProps<T = never> {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined; };
}

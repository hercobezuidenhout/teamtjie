import { PageProps } from '@/app/page-props';
import { ProfileTemplate } from './components/ProfileTemplate';

const Page = ({ params }: PageProps) => {
  const userId = params['userId'];

  return <ProfileTemplate userId={userId} />;
};


export default Page;

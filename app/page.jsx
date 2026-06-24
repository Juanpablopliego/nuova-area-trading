import { ContentProvider } from '@/components/ContentProvider';
import { App } from '@/components/App';

export default function Page() {
  return (
    <ContentProvider>
      <App />
    </ContentProvider>
  );
}

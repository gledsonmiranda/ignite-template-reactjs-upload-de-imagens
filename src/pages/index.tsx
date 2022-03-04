import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImageProps {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImagesProps {
  after: string;
  data: ImageProps[];
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ():Promise<GetImagesProps> => {
      const { data } = await api.get('api/images', {
        params: {
          pageParam: null
        }
      });

      return data;
    }
    ,
    {
      getNextPageParam: lastPage => lastPage?.after || null,
    }
  );

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(page => {
      return page.data.flat();
    })

    return formatted;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}

import Container from './container'
import cn from 'classnames'
import { EXAMPLE_PATH } from '@/lib/constants'
import Link from 'next/link';

type AlertProps = {
  preview: boolean,
};

const Alert = (props: AlertProps) => {
  const { preview } = props;
  return (

    <>
      <div
        className={cn('border-b', {
          'bg-accent-7 border-accent-7 text-white': preview,
          'bg-accent-1 border-accent-2': !preview,
        })}
      >
        <Container>
          <div className="py-2 text-center text-sm">
            {preview ? (
              <>
                This is page is a preview.{' '}
                <Link
                  href="/api/exit-preview"
                  className="underline hover:text-cyan duration-200 transition-colors"
                >
                  Click here
                </Link>{' '}
                to exit preview mode.
              </>
            ) : (
              <>
                The source code for this blog is{' '}
                <a
                  href={`https://github.com/cosmicjs/next-merge`}
                  className="underline hover:text-success duration-200 transition-colors"
                >
                  available on GitHub
                </a>
                .
              </>
            )}
          </div>
        </Container>
      </div>
    </>

  )
}


export default Alert;


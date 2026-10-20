import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

// set to a file in public/ once the club supplies a group photo; until then the placeholder frame shows
const PHOTO_SRC: string | null = null

/*
  the top of /about (layout from reference/screenshots/about-top.png): label and heading left, story right,
  a wide photo that straddles the paper and the cream wash, then mission and vision on the wash.
  copy is DRAFT, edited from docs/source/founding-document.md.
*/
export function AboutIntro() {
  return (
    <>
      <section className='bg-paper'>
        <div className='container-site pt-16 sm:pt-24'>
          <Reveal className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
            <h1 className='heading-section text-ink'>
              Health knowledge that reaches people before illness does.
            </h1>

            {/* top padding lines the lead up with the heading's first line */}
            <div className='flex flex-col gap-5 lg:pt-3'>
              <p className='font-body text-md md:text-lg font-semibold text-ink leading-[1.5]'>
                Most health problems are not sudden. They begin as small habits
                that no one explained.
              </p>
              <p className='font-body text-base md:text-md text-ink/70 leading-[1.7]'>
                A thirteen-year-old swaps water for sugary drinks, unaware of what
                it does to the kidneys. Someone who closes from work at seven and
                eats a heavy meal at eight has no idea the habit can lead to type 2
                diabetes. Traders in open-air markets cough and sneeze through the
                day without knowing the smoke and dust around them are to blame.
                People often sense that something is unhealthy, but not how much,
                or how often, it raises their risk.
              </p>
              <p className='font-body text-base md:text-md text-ink/70 leading-[1.7]'>
                Language widens the gap. Some people treat themselves rather than
                face a hospital they struggle to speak to. Others reach the
                consulting room and cannot describe what they feel.
              </p>
              <p className='font-body text-base md:text-md text-ink/70 leading-[1.7]'>
                Health Custodians Club brings together students from across the
                health sciences to close that gap through training, research and
                sensitisation. When people understand their risks early, illness
                is prevented or caught sooner, and they seek care knowing what to
                say.
              </p>
            </div>
          </Reveal>
        </div>

        {/* the cream wash starts halfway down the photo and carries on into mission and vision */}
        <div className='relative mt-14 sm:mt-20'>
          <div aria-hidden className='absolute inset-x-0 top-1/2 bottom-0 bg-cream/20' />
          <div className='container-site relative'>
            <Reveal className='relative aspect-[4/3] overflow-hidden rounded-md border border-rule bg-paper shadow-image sm:aspect-[21/9]'>
              {PHOTO_SRC ? (
                <Image
                  src={PHOTO_SRC}
                  alt='Health Custodians Club members together'
                  fill
                  sizes='(min-width: 1440px) 1376px, 88vw'
                  className='object-cover'
                />
              ) : (
                <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
                  <ImageIcon className='size-10 text-muted' aria-hidden />
                  <span className='font-mono text-label uppercase text-muted'>
                    Photo to come
                  </span>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className='bg-cream/20'>
        <div className='container-site grid gap-14 py-20 sm:py-24 md:grid-cols-2 md:gap-16'>
          <Reveal>
            <p className='font-mono text-label uppercase text-muted'>Our mission</p>
            <h2 className='mt-4 font-body text-h3 font-semibold text-ink'>
              Healthier communities, served by better-prepared health students.
            </h2>
            <p className='mt-5 font-body text-base md:text-md text-ink/70 leading-[1.7]'>
              We help members discover and pursue their aspirations. We work to
              reduce the burden of disease in Africa through education, outreach
              and advocacy. We develop disciplined, purpose-driven leaders. We make
              health information simple enough for anyone to use. We build a
              culture of research and evidence-based advocacy. And we connect
              students, professionals, researchers and other stakeholders so they
              can work together.
            </p>
          </Reveal>

          <Reveal index={1}>
            <p className='font-mono text-label uppercase text-muted'>Our vision</p>
            <h2 className='mt-4 font-body text-h3 font-semibold text-ink'>
              A leading hub for the next generation of health professionals.
            </h2>
            <p className='mt-5 font-body text-base md:text-md text-ink/70 leading-[1.7]'>
              To develop health students with the practical, leadership,
              communication, research and interpersonal skills that go beyond the
              university curriculum, so they excel in their careers, serve
              communities well and help improve health outcomes.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

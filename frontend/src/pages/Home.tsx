import { Link } from 'react-router-dom';
import { Container, Section } from '../components/ui/Layout';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-100/50 blur-[120px] rounded-full -z-10" />

        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 rounded-full">
              Shop Green. Live Green.
            </div>

            <Heading level={1} className="mb-6 leading-[1.1]">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
                Eco-Friendly
              </span>{' '}
              Businesses Near You
            </Heading>

            <Text className="text-xl mb-10 text-slate-500 max-w-2xl mx-auto">
              EcoConnect brings together zero-waste shops, repair cafés, local food producers,
              and eco-services across Coventry and Warwickshire.
            </Text>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/directory">
                <Button variant="success" className="w-full sm:w-auto px-10 py-4 text-lg">
                  Browse the Directory →
                </Button>
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                style={{ textDecoration: 'none' }}
              >
                Join EcoConnect →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <Section bg="bg-white">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} className="mb-4">Why EcoConnect?</Heading>
            <Text className="max-w-xl mx-auto">
              We make it simple to find, support, and review sustainable businesses in your community.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '♻️', title: 'Zero Waste Shops', desc: 'Find stores committed to reducing packaging and waste in our directory.' },
              { icon: '🔧', title: 'Repair Cafés', desc: 'Keep items out of landfill by getting them fixed locally and affordably.' },
              { icon: '🥦', title: 'Local Food Producers', desc: 'Support farmers and food producers growing sustainably near you.' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="text-center p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <Heading level={3} className="mb-3">{title}</Heading>
                <Text>{desc}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

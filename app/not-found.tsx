import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-[Arvo,serif] flex items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css?family=Arvo');
        
        .four_zero_four_bg {
          background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
          height: 400px;
          background-position: center;
          background-repeat: no-repeat;
        }
        `
      }} />

      <section className="page_404 w-full max-w-4xl mx-auto text-center">
        <div className="four_zero_four_bg flex justify-center items-start pt-10 rounded-3xl mb-[-50px]">
          <h1 className="text-7xl md:text-9xl font-black text-black">404</h1>
        </div>

        <div className="contant_box_404 relative z-10 bg-white inline-block px-10 py-8 rounded-3xl shadow-[0_-20px_40px_rgba(255,255,255,1)]">
          <h3 className="text-3xl md:text-5xl font-black mb-4">Looks like you're lost</h3>
          <p className="text-xl text-gray-500 mb-8">The page you are looking for is not available!</p>
          
          <Link 
            href="/" 
            className="text-white px-8 py-4 bg-[#39ac31] hover:bg-[#2d8f25] rounded-full inline-block font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Go to Headquarters
          </Link>
        </div>
      </section>
    </div>
  );
}

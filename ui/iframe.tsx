import React from "react";

interface IframeProps {
  url: string;
  title: string;
}

const Iframe: React.FC<IframeProps> = ({ url, title }) => {
  return (
    <div className="w-full overflow-hidden bg-black relative" style={{ height: '500px' }}>
      <style jsx>{`
        iframe::-webkit-scrollbar {
          display: none;
        }
        iframe {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <iframe
        src={url}
        title={title}
        loading="lazy"
        className="border-0"
        style={{
          width: '1880px',
          height: '1200px',
          zoom: 0.5,          // scale এর বদলে zoom
        //   pointerEvents: 'none',
        }}
      />
      {/* <div className="absolute inset-0 bg-transparent z-10" /> */}
    </div>
  );
};
export default Iframe;

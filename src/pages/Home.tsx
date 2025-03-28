import { bg_gradient } from "../images";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Banner */}
      <div
        style={{
          backgroundImage: `url(${bg_gradient})`,
          backgroundSize: "cover",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          minHeight: "100vh",

          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "128px", color: "white", margin: 0 }}>
            Quantum Modeling
          </h1>
          <p style={{fontSize: "28px"}}>Quantum phenomena visualized & explained.</p>

          <Link
            to="/Tunneling"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                borderStyle: "none",
                color: "navy",
                fontSize: "25px",
                padding: "10px",
                cursor: "pointer",
                marginLeft: "20px",
                marginRight: "40px",
             }}
             > Start Modeling</button>
          </Link>
          <div className="down-arrow"></div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "25px" }}>
        <p>
          Welcome to the Quantum Computing Lab at the University of Florida! Our
          team works under Dr. Jing Guo in the Electrical Engineering Department
          and we've been working on creating more accessibility in the field of
          quantum computing. We build this website so that anyone can explore
          and have fun with these concepts.
        </p>
        <h2>How this website works</h2>
        <p>
          Click on "Start Modeling" above and it will take you to quantum
          phenomena you can experiment with. Once you're there, you can try out
          different inputs and their simulations will pop up! For example, you
          can go to the tunneling phenomena and play around with the momentum
          and barrier thickness. We'll have descriptions of whats happening on
          each page, so you'll be able to understand exactly what's happening.
          Have fun!
        </p>
        <h2>Try it yourself</h2>
        <p>
          Our model generators and documentation to create your own models and
          more can be found{" "}
          <a href="https://github.com/uf-quantum-computing/quantum_modeling_app">here</a>!
        </p>
      </div>
    </div>
  );
};

export default Home;

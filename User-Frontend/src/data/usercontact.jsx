import './css/contact.css';

export const Usercontact = () => {
    return (
        <>
            <div className='container-con'>
            <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
                <form className="mb-3  ">
                    <div><h2>Contact Us</h2></div>
                    <div className="mb-3 ">
                        <label for="exampleInputText1" className="form-label">Name</label>
                        <input type="text" className="form-control" id="exampleInputText1" aria-describedby="emailHelp" />
                        {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div className="mb-3 ">
                        <label for="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputNumber1" className="form-label">Mob. No.</label>
                        <input type="number" className="form-control" id="exampleInputNumber1" />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            </div>
        </>
    )
}
